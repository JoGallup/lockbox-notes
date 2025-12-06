// Internationalization utilities

export type Language = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja';

export interface TranslationKeys {
  // Common UI
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.cancel': string;
  'common.confirm': string;
  'common.save': string;
  'common.delete': string;
  'common.edit': string;
  'common.create': string;
  'common.search': string;
  'common.filter': string;

  // Experiment related
  'experiment.create': string;
  'experiment.name': string;
  'experiment.steps': string;
  'experiment.created': string;
  'experiment.encrypted': string;
  'experiment.decrypted': string;

  // Step related
  'step.title': string;
  'step.content': string;
  'step.add': string;
  'step.delete.confirm': string;

  // Wallet
  'wallet.connect': string;
  'wallet.disconnect': string;
  'wallet.wrong.network': string;

  // Errors
  'error.network': string;
  'error.contract': string;
  'error.validation': string;
  'error.insufficient.funds': string;
  'error.transaction.cancelled': string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',

    'experiment.create': 'Create Experiment',
    'experiment.name': 'Experiment Name',
    'experiment.steps': 'Steps',
    'experiment.created': 'Created',
    'experiment.encrypted': 'Encrypted',
    'experiment.decrypted': 'Decrypted',

    'step.title': 'Step Title',
    'step.content': 'Step Content',
    'step.add': 'Add Step',
    'step.delete.confirm': 'Are you sure you want to delete this step?',

    'wallet.connect': 'Connect Wallet',
    'wallet.disconnect': 'Disconnect',
    'wallet.wrong.network': 'Wrong network',

    'error.network': 'Network error',
    'error.contract': 'Contract error',
    'error.validation': 'Validation error',
    'error.insufficient.funds': 'Insufficient funds',
    'error.transaction.cancelled': 'Transaction cancelled',
  },

  zh: {
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.create': '创建',
    'common.search': '搜索',
    'common.filter': '筛选',

    'experiment.create': '创建实验',
    'experiment.name': '实验名称',
    'experiment.steps': '步骤',
    'experiment.created': '已创建',
    'experiment.encrypted': '已加密',
    'experiment.decrypted': '已解密',

    'step.title': '步骤标题',
    'step.content': '步骤内容',
    'step.add': '添加步骤',
    'step.delete.confirm': '确定要删除此步骤吗？',

    'wallet.connect': '连接钱包',
    'wallet.disconnect': '断开连接',
    'wallet.wrong.network': '网络错误',

    'error.network': '网络错误',
    'error.contract': '合约错误',
    'error.validation': '验证错误',
    'error.insufficient.funds': '资金不足',
    'error.transaction.cancelled': '交易已取消',
  },

  es: {
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',

    'experiment.create': 'Crear Experimento',
    'experiment.name': 'Nombre del Experimento',
    'experiment.steps': 'Pasos',
    'experiment.created': 'Creado',
    'experiment.encrypted': 'Encriptado',
    'experiment.decrypted': 'Desencriptado',

    'step.title': 'Título del Paso',
    'step.content': 'Contenido del Paso',
    'step.add': 'Agregar Paso',
    'step.delete.confirm': '¿Está seguro de que desea eliminar este paso?',

    'wallet.connect': 'Conectar Billetera',
    'wallet.disconnect': 'Desconectar',
    'wallet.wrong.network': 'Red incorrecta',

    'error.network': 'Error de red',
    'error.contract': 'Error de contrato',
    'error.validation': 'Error de validación',
    'error.insufficient.funds': 'Fondos insuficientes',
    'error.transaction.cancelled': 'Transacción cancelada',
  },

  fr: {
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Sauvegarder',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',

    'experiment.create': 'Créer une Expérience',
    'experiment.name': 'Nom de l\'Expérience',
    'experiment.steps': 'Étapes',
    'experiment.created': 'Créé',
    'experiment.encrypted': 'Chiffré',
    'experiment.decrypted': 'Déchiffré',

    'step.title': 'Titre de l\'Étape',
    'step.content': 'Contenu de l\'Étape',
    'step.add': 'Ajouter une Étape',
    'step.delete.confirm': 'Êtes-vous sûr de vouloir supprimer cette étape ?',

    'wallet.connect': 'Connecter le Portefeuille',
    'wallet.disconnect': 'Déconnecter',
    'wallet.wrong.network': 'Mauvais réseau',

    'error.network': 'Erreur réseau',
    'error.contract': 'Erreur de contrat',
    'error.validation': 'Erreur de validation',
    'error.insufficient.funds': 'Fonds insuffisants',
    'error.transaction.cancelled': 'Transaction annulée',
  },

  de: {
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.create': 'Erstellen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',

    'experiment.create': 'Experiment Erstellen',
    'experiment.name': 'Experiment Name',
    'experiment.steps': 'Schritte',
    'experiment.created': 'Erstellt',
    'experiment.encrypted': 'Verschlüsselt',
    'experiment.decrypted': 'Entschlüsselt',

    'step.title': 'Schritt Titel',
    'step.content': 'Schritt Inhalt',
    'step.add': 'Schritt Hinzufügen',
    'step.delete.confirm': 'Sind Sie sicher, dass Sie diesen Schritt löschen möchten?',

    'wallet.connect': 'Wallet Verbinden',
    'wallet.disconnect': 'Trennen',
    'wallet.wrong.network': 'Falsches Netzwerk',

    'error.network': 'Netzwerkfehler',
    'error.contract': 'Vertragsfehler',
    'error.validation': 'Validierungsfehler',
    'error.insufficient.funds': 'Unzureichende Mittel',
    'error.transaction.cancelled': 'Transaktion abgebrochen',
  },

  ja: {
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.confirm': '確認',
    'common.save': '保存',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.create': '作成',
    'common.search': '検索',
    'common.filter': 'フィルター',

    'experiment.create': '実験を作成',
    'experiment.name': '実験名',
    'experiment.steps': 'ステップ',
    'experiment.created': '作成済み',
    'experiment.encrypted': '暗号化済み',
    'experiment.decrypted': '復号化済み',

    'step.title': 'ステップタイトル',
    'step.content': 'ステップ内容',
    'step.add': 'ステップを追加',
    'step.delete.confirm': 'このステップを削除してもよろしいですか？',

    'wallet.connect': 'ウォレットを接続',
    'wallet.disconnect': '切断',
    'wallet.wrong.network': '間違ったネットワーク',

    'error.network': 'ネットワークエラー',
    'error.contract': 'コントラクトエラー',
    'error.validation': '検証エラー',
    'error.insufficient.funds': '資金不足',
    'error.transaction.cancelled': '取引がキャンセルされました',
  },
};

class I18n {
  private currentLanguage: Language = 'en';

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
  }

  getLanguage(): Language {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language') as Language;
      if (stored && stored in translations) {
        return stored;
      }

      // Auto-detect from browser
      const browserLang = navigator.language.split('-')[0] as Language;
      if (browserLang in translations) {
        return browserLang;
      }
    }

    return 'en';
  }

  t(key: keyof TranslationKeys): string {
    const lang = this.currentLanguage;
    return translations[lang]?.[key] || translations.en[key] || key;
  }

  getAvailableLanguages(): Array<{ code: Language; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'ja', name: '日本語' },
    ];
  }

  // Initialize language on first load
  init(): void {
    this.currentLanguage = this.getLanguage();
  }
}

export const i18n = new I18n();

// React hook for using translations
export function useTranslation() {
  return {
    t: i18n.t.bind(i18n),
    setLanguage: i18n.setLanguage.bind(i18n),
    getLanguage: i18n.getLanguage.bind(i18n),
    getAvailableLanguages: i18n.getAvailableLanguages.bind(i18n),
  };
}

// Initialize on module load
if (typeof window !== 'undefined') {
  i18n.init();
}
