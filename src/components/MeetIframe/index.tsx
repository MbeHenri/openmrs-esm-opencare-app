import React, { useEffect, useRef, useState } from "react";
import styles from "./index.scss";

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

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      setShowPreloader(true);
      const handleLoad = () => {
        try {
          const iframeWindow = iframe.contentWindow;
          if (!iframeWindow) {
            console.error("Impossible d'accéder à la fenêtre de l'iframe.");
            setShowPreloader(false);
            return;
          }

          const iframeDocument = iframeWindow.document;

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

            // Soumettre le formulaire
            loginForm.submit();
            // on affiche le preloader

            // eslint-disable-next-line no-console
            console.log("Formulaire de connexion soumis.");
            setShowPreloader(false);
            //console.log('username', userInput.value, 'password', passwordInput.value);
          } else {
            setShowPreloader(false);
          }
        } catch (error) {
          console.error(
            "Erreur lors de l'accès au contenu de l'iframe :",
            error
          );
          setShowPreloader(false);
        }
      };

      // Associer l'événement de chargement
      iframe.addEventListener("load", handleLoad);

      // Nettoyage de l'événement lors du démontage du composant
      return () => {
        iframe.removeEventListener("load", handleLoad);
      };
    }
  }, [token, username]);

  return (
    <div className={styles.contentViewWrapper}>
      <div
        className={styles.preloader}
        style={{ display: showPreloader ? "block" : "none" }}
      >
        <span className={styles.spinner}></span>
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
