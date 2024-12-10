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
    };
  };
}
