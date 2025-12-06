"use client";

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useExperimentLog } from './useExperimentLog';

export interface BatchOperation {
  id: string;
  type: 'delete' | 'transfer';
  stepId?: string;
  experimentId?: string;
  newOwner?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export function useBatchOperations() {
  const [operations, setOperations] = useState<BatchOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const experimentLog = useExperimentLog();
  const processingRef = useRef(false);

  const addOperation = useCallback((operation: Omit<BatchOperation, 'id' | 'status'>) => {
    const newOperation: BatchOperation = {
      ...operation,
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
    };

    setOperations(prev => [...prev, newOperation]);
    return newOperation.id;
  }, []);

  const removeOperation = useCallback((operationId: string) => {
    setOperations(prev => prev.filter(op => op.id !== operationId));
  }, []);

  const updateOperationStatus = useCallback((operationId: string, status: BatchOperation['status'], error?: string) => {
    setOperations(prev =>
      prev.map(op =>
        op.id === operationId
          ? { ...op, status, error: error || op.error }
          : op
      )
    );
  }, []);

  const processBatchOperations = useCallback(async () => {
    if (processingRef.current || operations.length === 0) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    const pendingOps = operations.filter(op => op.status === 'pending');

    if (pendingOps.length === 0) {
      setIsProcessing(false);
      processingRef.current = false;
      return;
    }

    toast.info(`Processing ${pendingOps.length} batch operation${pendingOps.length > 1 ? 's' : ''}...`);

    try {
      // Process delete operations in batches
      const deleteOps = pendingOps.filter(op => op.type === 'delete');
      if (deleteOps.length > 0) {
        const stepIds = deleteOps.map(op => op.stepId!).filter(Boolean);

        if (stepIds.length > 0) {
          deleteOps.forEach(op => updateOperationStatus(op.id, 'processing'));

          const success = await experimentLog.batchDeleteSteps(stepIds);

          deleteOps.forEach(op => {
            updateOperationStatus(op.id, success ? 'completed' : 'failed',
              success ? undefined : 'Batch delete failed');
          });
        }
      }

      // Process transfer operations individually (they need different newOwner addresses)
      const transferOps = pendingOps.filter(op => op.type === 'transfer');
      for (const op of transferOps) {
        if (!op.experimentId || !op.newOwner) continue;

        updateOperationStatus(op.id, 'processing');

        try {
          const success = await experimentLog.transferExperimentOwnership(op.experimentId, op.newOwner);
          updateOperationStatus(op.id, success ? 'completed' : 'failed',
            success ? undefined : 'Ownership transfer failed');
        } catch (error: any) {
          updateOperationStatus(op.id, 'failed', error.message || 'Unknown error');
        }
      }

      const completed = operations.filter(op => op.status === 'completed').length;
      const failed = operations.filter(op => op.status === 'failed').length;

      if (completed > 0) {
        toast.success(`Successfully completed ${completed} operation${completed > 1 ? 's' : ''}`);
      }

      if (failed > 0) {
        toast.error(`Failed to complete ${failed} operation${failed > 1 ? 's' : ''}`);
      }

    } catch (error: any) {
      console.error('Batch operations failed:', error);
      toast.error('Batch operations failed: ' + error.message);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [operations, experimentLog, updateOperationStatus]);

  const clearCompletedOperations = useCallback(() => {
    setOperations(prev => prev.filter(op => op.status !== 'completed'));
  }, []);

  const clearAllOperations = useCallback(() => {
    setOperations([]);
  }, []);

  const getOperationStats = useCallback(() => {
    return {
      total: operations.length,
      pending: operations.filter(op => op.status === 'pending').length,
      processing: operations.filter(op => op.status === 'processing').length,
      completed: operations.filter(op => op.status === 'completed').length,
      failed: operations.filter(op => op.status === 'failed').length,
    };
  }, [operations]);

  return {
    operations,
    isProcessing,
    addOperation,
    removeOperation,
    processBatchOperations,
    clearCompletedOperations,
    clearAllOperations,
    getOperationStats,
  };
}
