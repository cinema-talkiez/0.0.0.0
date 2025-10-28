export default function SharePage() {
    const mediafireLink = "https://www.mediafire.com/file/example.apk";
    const shareMessage = `Ee App download chesko mama: ${mediafireLink}`;
  
  const handleTelegramShare = () => {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(mediafireLink)}&text=${encodeURIComponent("Download this APK")}`;
      window.open(telegramUrl, "_blank", "noopener,noreferrer");
    };
    
  
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Share APK</h1>
        <p>{shareMessage}</p>
        <button 
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }} 
          onClick={handleTelegramShare}
        >
          Share on Telegram
        </button>
      </div>
    );
  }
  