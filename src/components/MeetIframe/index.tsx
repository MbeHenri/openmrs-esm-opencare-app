import React, { useCallback, useEffect, useRef } from "react";
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

  const handleLoad = useCallback(() => {
    try {
      const iframe = iframeRef.current;
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) {
        /* console.error("Impossible d'accéder à la fenêtre de l'iframe."); */
        return;
      }

      const iframeDocument = iframeWindow.document;

      // Remplacer les sélecteurs par les IDs ou classes réels utilisés par Nextcloud
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

        /* console.log("Formulaire de connexion soumis."); */
      } else {
        console.error("Champs de formulaire introuvables dans l'iframe.");
      }
    } catch (error) {
      console.error("Erreur lors de l'accès au contenu de l'iframe :", error);
    }
  }, [token, username]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      // Associer l'événement de chargement
      iframe.addEventListener("load", handleLoad);

      // Nettoyage de l'événement lors du démontage du composant
      return () => {
        iframe.removeEventListener("load", handleLoad);
      };
    }
  }, [handleLoad]);

  return (
    <div className={styles.contentViewWrapper}>
      <span className={styles.spinner}></span>
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
