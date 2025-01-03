import { useEffect } from "react";

function ChatSupport() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/67768d36af5bfec1dbe5cb9d/1igjhf7p3";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    const user = sessionStorage.getItem('user')
    script.onload = () => {
        if (window.Tawk_API) {
          window.Tawk_API.setAttributes(
            {
              name: user.name, // Replace with your dynamic user data
              email: user.email, // Replace with user email
              userId: user.id, // Optional unique ID for the user
            },
            (error) => {
              if (error) {
                console.error("Failed to set user attributes:", error);
              }
            }
          );
        }
      };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

export default ChatSupport;
