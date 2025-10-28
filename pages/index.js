import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const [userId, setUserId] = useState(null);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("🟦 [Init] Starting IndexPage useEffect...");

    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    let uid = localStorage.getItem("userId");
    let createdAt = localStorage.getItem("createdAt");

    console.log("📦 [LocalStorage before check]", { uid, createdAt });

    // Invalidate old user ID
    if (uid && createdAt && Date.now() - parseInt(createdAt) > MAX_AGE) {
      console.warn("⚠️ [LocalStorage] User ID expired. Clearing localStorage.");
      localStorage.clear();
      uid = null;
    }

    // Generate new user ID if needed
    if (!uid) {
      uid = generateUUID();
      localStorage.setItem("userId", uid);
      localStorage.setItem("createdAt", Date.now().toString());
      console.log("🆕 [LocalStorage] Generated new userId:", uid);
    }

    setUserId(uid);
    console.log("🧩 [UserID Set] userId =", uid);

    // Fetch tokenVerified from DB
    console.log("🌐 [Fetch] Checking token verification in DB for:", uid);

    fetch(`/.netlify/functions/check/${uid}`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ [DB Response]", data);

        const isVerifiedInDB = data.exists && data.tokenVerified === true;
        setTokenVerified(isVerifiedInDB);
        console.log("🔎 [DB Token Verified]", isVerifiedInDB);

        // Check localStorage for short-lived token
        const storedValidToken = localStorage.getItem("validToken") === "true";
        const validTokenExp = localStorage.getItem("validTokenExpiration");
        const isNotExpired = validTokenExp && Date.now() < parseInt(validTokenExp);

        console.log("💾 [Local Token Check]", {
          storedValidToken,
          validTokenExp,
          isNotExpired
        });

        const isValidToken = storedValidToken && isNotExpired;
        setValidToken(isValidToken);
        console.log("🔒 [Final Token Validity]", isValidToken);

        setLoading(false);
      })
      .catch(err => {
        console.error("❌ [Fetch Error] DB check failed:", err);
        setLoading(false);
      });
  }, []);

  const generateUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  console.log("🧭 [Render State]", {
    userId,
    tokenVerified,
    validToken,
    loading
  });

  return (
    <div className="glassmorphism-page">
      <div className="container5">
        <h1>Welcome to BlackHole</h1>
        <p>
          BlackHole is specially designed for middle-class movie lovers. This is
          affordable entertainment with a vast collection of movies without the
          financial burden.
        </p>

        {/* CONDITIONAL BUTTONS */}
        {tokenVerified && validToken ? (
          <button
            onClick={() => {
              console.log("🟩 [Action] Navigating to /index1");
              router.push("/index1");
            }}
            className="visitButton"
          >
            Visit HomePage
          </button>
        ) : tokenVerified && !validToken ? (
          <div>
            <p>✅ Token is verified in DB. Please finalize it...</p>
            <button
              onClick={() => {
                console.log("🟧 [Action] Navigating to /verification-success");
                router.push("/verification-success");
              }}
              className="verifyButton"
            >
              Set Token
            </button>
          </div>
        ) : (
          <div className="container">
            {loading ? (
              <p className="loading-text">Checking token status...</p>
            ) : (
              <>
                <p style={{ color: "yellow", fontSize: "15px" }}>
                  ⚠️ Token not verified. Please verify first.
                </p>
                <button
                  onClick={() => {
                    console.log("🟥 [Action] Navigating to /Verifypage.html");
                    router.push("/Verifypage.html");
                  }}
                  className="verifyButton"
                >
                  Go to Verify Page
                </button>
              </>
            )}
          </div>
        )}

        <style jsx>{`
          .container5 {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
          }
          .verify-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          .loading-text {
            font-size: 15px;
            color: yellow;
            font-weight: 500;
            margin: 0;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            backdrop-filter: blur(5px);
          }
          button {
            padding: 12px 24px;
            font-size: 18px;
            border: none;
            cursor: pointer;
            border-radius: 8px;
            transition: 0.3s;
            margin: 10px;
            width: 200px;
          }
          .verifyButton {
            background-color: #ff5722;
            color: white;
          }
          .visitButton {
            background-color: #4caf50;
            color: white;
          }
          .visitButton:hover {
            background-color: #388e3c;
          }
        `}</style>
      </div>
    </div>
  );
}
