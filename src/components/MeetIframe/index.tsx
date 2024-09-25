import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.scss";
import logo from "../../assets/img/Logo.png";

interface MeetIframeProps {
  username: string;
  token: string;
  url: string;
}

export const MeetIframe: React.FC<MeetIframeProps> = ({
  url,
  token,
  username,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [showPreloader, setShowPreloader] = useState(false);
  const [needContinue, setNeedContinue] = useState(true);

  const handleLogin = useCallback(
    async (iframe: HTMLIFrameElement) => {
      try {
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow) {
          console.error("Impossible d'accéder à la fenêtre de l'iframe.");
          setShowPreloader(false);
          return;
        }

        const iframeDocument = iframeWindow.document;

        const isLoggedIn = iframeDocument.querySelector(".user-menu");
        if (isLoggedIn) {
          //console.log("Utilisateur déjà connecté.");
          setShowPreloader(false);
          return; // Pas besoin de soumettre le formulaire
        }

        const userInput = iframeDocument.querySelector(
          'input[name="user"]'
        ) as HTMLInputElement | null;
        const passwordInput = iframeDocument.querySelector(
          'input[name="password"]'
        ) as HTMLInputElement | null;
        const loginForm = iframeDocument.querySelector(
          "form"
        ) as HTMLFormElement | null;

        if (userInput && passwordInput && loginForm) {
          userInput.value = username;
          passwordInput.value = token;

          // Attendre 3 secondes avant de soumettre le formulaire
          setTimeout(() => {
            loginForm.submit();
            // eslint-disable-next-line no-console
            console.log("Formulaire de connexion soumis.");
          }, 3000); // Délai de 3 secondes
          //console.log('username', userInput.value, 'password', passwordInput.value);
        } else {
          setShowPreloader(false);
        }
      } catch (error) {
        console.error("Erreur lors de l'accès au contenu de l'iframe :", error);
        setShowPreloader(false);
      }
    },
    [token, username]
  );

  const handleLoad = useCallback(
    async (iframe: HTMLIFrameElement) => {
      if (needContinue) {
        await handleLogin(iframe).finally(() => setNeedContinue(false));
      } else {
        setShowPreloader(false);
      }
    },
    [handleLogin, needContinue]
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      setShowPreloader(true);
      const load = () => handleLoad(iframe);

      // Associer l'événement de chargement
      iframe.addEventListener("load", load);

      // Nettoyage de l'événement lors du démontage du composant
      return () => {
        iframe.removeEventListener("load", load);
      };
    }
  }, [handleLoad]);

  return (
    <div className={styles.contentViewWrapper}>
      <div
        className={styles.preloader}
        style={{ display: showPreloader ? "flex" : "none" }}
      >
        <span className={styles.spinner}></span>
        <img src={logo} alt="opencare logo" className="logo" />
      </div>
      <iframe
        ref={iframeRef}
        className={styles.viewer}
        title="Web Meeting"
        src={url}
        allow="camera;microphone"
      />
    </div>
  );
};

export default MeetIframe;
