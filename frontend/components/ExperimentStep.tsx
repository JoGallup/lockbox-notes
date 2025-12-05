"use client";

import { useState } from 'react';
import { Lock, Unlock, Trash2, Edit3, Save, X, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ExperimentStepProps {
  id: string;
  title: string;
  content: string;
  isEncrypted: boolean;
  stepNumber?: number;
  onToggleEncryption: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, content: string) => void;
}

export function ExperimentStep({
  id,
  title,
  content,
  isEncrypted,
  stepNumber,
  onToggleEncryption,
  onDelete,
  onUpdate,
}: ExperimentStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [showContent, setShowContent] = useState(!isEncrypted);

  const handleSave = () => {
    onUpdate(id, editTitle, editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditContent(content);
  };

  const encryptedContent = '•'.repeat(Math.min(content.length, 50)) + (content.length > 50 ? '...' : '');
  const displayContent = isEncrypted && !showContent ? encryptedContent : content;

  return (
    <Card className="glass-card overflow-hidden hover-lift group">
      {/* Step Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-border/50 ${
        isEncrypted 
          ? 'bg-gradient-to-r from-[hsl(var(--encrypted))]/10 to-[hsl(var(--lab-purple))]/5' 
          : 'bg-gradient-to-r from-[hsl(var(--lab-blue))]/10 to-[hsl(var(--lab-teal))]/5'
      }`}>
        <div className="flex items-center gap-3">
          {stepNumber && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
              isEncrypted 
                ? 'bg-[hsl(var(--encrypted))]/20 text-[hsl(var(--encrypted))]' 
                : 'bg-[hsl(var(--lab-blue))]/20 text-[hsl(var(--lab-blue))]'
            }`}>
              {stepNumber}
            </div>
          )}
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
            isEncrypted 
              ? 'bg-[hsl(var(--encrypted))]/10 text-[hsl(var(--encrypted))] border border-[hsl(var(--encrypted))]/20' 
              : 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border border-[hsl(var(--success))]/20'
          }`}>
            {isEncrypted ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            {isEncrypted ? 'Encrypted' : 'Decrypted'}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              {isEncrypted && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowContent(!showContent)}
                  className="h-8 w-8 p-0"
                  title={showContent ? "Hide content" : "Show content"}
                >
                  {showContent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
                title="Edit step"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleEncryption(id)}
                className="h-8 w-8 p-0"
                title={isEncrypted ? "Decrypt (requires signature)" : "Encrypt (requires signature)"}
              >
                <Shield className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Delete step"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Step title"
              className="font-semibold bg-background/50"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Step details, data, parameters..."
              rows={4}
              className="bg-background/50 resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="bg-gradient-to-r from-[hsl(var(--lab-blue))] to-[hsl(var(--lab-teal))]">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              {isEncrypted && <Lock className="h-4 w-4 text-[hsl(var(--encrypted))]" />}
              {title}
            </h3>
            <div className={`text-sm leading-relaxed whitespace-pre-wrap rounded-lg p-4 ${
              isEncrypted && !showContent
                ? 'bg-[hsl(var(--encrypted))]/5 text-[hsl(var(--encrypted))]/70 font-mono border border-[hsl(var(--encrypted))]/10'
                : 'bg-muted/30 text-muted-foreground'
            }`}>
              {displayContent}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
