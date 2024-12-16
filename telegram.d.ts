// telegram.d.ts
interface Window {
  Telegram?: {
    WebApp: {
      close(): unknown;
      initDataUnsafe: {
        user
      };
      ready(): unknown;
      openLink: (url: string) => void;
      isExpanded: boolean;
      viewportHeight: number;
      viewportStableHeight: number;
      platform: Platforms;
      headerColor: `#${string}`;
      backgroundColor: `#${string}`;
      isClosingConfirmationEnabled: boolean;
      themeParams: ThemeParams;
      initDataUnsafe: WebAppInitData;
      initData: string;
      colorScheme: "light" | "dark";
      onEvent: <T extends EventNames>(
        eventName: T,
        callback: (params: EventParams[T]) => unknown
      ) => void;
      offEvent: <T extends EventNames>(
        eventName: T,
        callback: (params: EventParams[T]) => unknown
      ) => void;
      sendData: (data: unknown) => void;
      close: VoidFunction;
      expand: VoidFunction;
      MainButton: MainButton;
      SecondaryButton: SecondaryButton;
      HapticFeedback: HapticFeedback;
      CloudStorage: CloudStorage;
      openLink: (link: string, options?: { try_instant_view: boolean }) => void;
      openTelegramLink: (link: string) => void;
      BackButton: BackButton;
      SettingsButton: SettingsButton;
      version: string;
      isVersionAtLeast: (version: string) => boolean;
      openInvoice: (
        url: string,
        callback?: (status: InvoiceStatuses) => unknown
      ) => void;
      setHeaderColor: (
        color: "bg_color" | "secondary_bg_color" | `#${string}`
      ) => void;
      setBackgroundColor: (
        color: "bg_color" | "secondary_bg_color" | `#${string}`
      ) => void;
      showConfirm: (
        message: string,
        callback?: (confirmed: boolean) => void
      ) => void;
      showPopup: (params: PopupParams, callback?: (id?: string) => unknown) => void;
      showAlert: (message: string, callback?: () => unknown) => void;
      enableClosingConfirmation: VoidFunction;
      disableClosingConfirmation: VoidFunction;
      showScanQrPopup: (
        params: ScanQrPopupParams,
        callback?: (text: string) => void | true
      ) => void;
      closeScanQrPopup: () => void;
      readTextFromClipboard: (callback?: (text: string) => unknown) => void;
      ready: VoidFunction;
      switchInlineQuery: (
        query: string,
        chooseChatTypes?: Array<"users" | "bots" | "groups" | "channels">
      ) => void;
      requestWriteAccess: (callback?: (access: boolean) => unknown) => void;
      requestContact: (callback?: (access: boolean) => unknown) => void;
      BiometricManager: BiometricManager;
      isVerticalSwipesEnabled: boolean;
      enableVerticalSwipes: VoidFunction;
      disableVerticalSwipes: VoidFunction;
      shareToStory: (mediaURL: string, params?: ShareStoryParams) => void;
      bottomBarColor: string;
      setBottomBarColor: (bottomBarColor: string) => void;
    };
  };
}
