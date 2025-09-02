"use client";
import MaisysLogo from "@/components/MaisysLogo";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/UserContext";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useUserContext();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("Login attempt:", { username, password, userDepartment: user?.department });
    
    // Simule une authentification
    setTimeout(() => {
      setLoading(false);
      if (
        (username === "admin" && password === "DeOrEr46") ||
        (username === "laregionalesa\\dimitri.kimaka" && password === "DeOrEr46")
      ) {
        // Determine role based on username
        const role = username === "admin" ? "admin" : "employee";
        const newUser = {
          name: username,
          role: role as "admin" | "employee",
          department: user?.department
        };
        
        console.log("Login successful, setting user:", newUser);
        setUser(newUser);
        
        // Redirect based on role and department
        if (role === "admin") {
          console.log("Redirecting admin to orchestra dashboard");
          router.push("/orchestra/dashboard");
        } else {
          console.log("Redirecting employee to coworker home");
          router.push("/coworker/home");
        }
      } else {
        console.log("Login failed: invalid credentials");
        setError("Identifiants incorrects. Veuillez réessayer.");
      }
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full bg-[var(--background)] text-[var(--foreground)] px-2 py-8">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <MaisysLogo size={56} />
        </div>
        
      
        
        <div className="flex flex-col md:flex-row w-full gap-6">
          {/* Colonne gauche : login */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <form
              className="w-full bg-[var(--background)] rounded-2xl p-8 flex flex-col gap-4 border border-[var(--color-sky-blue)] shadow-lg"
              onSubmit={handleContinue}
            >
              <div className="mb-2 text-center">
                <span className="text-[var(--color-golden-yellow)] font-micro5 text-2xl mt-2 mb-1">
                  MAiSYS
                </span>
                <div className="text-sm text-[var(--color-light-yellow)] mt-1">Bienvenue sur la plateforme intelligente de gestion de workflows</div>
                {user?.department && (
                  <div className="text-xs text-[var(--color-light-blue)] mt-2">
                    Département: {user.department}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    className="rounded-md px-10 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--color-light-blue)] w-full placeholder:text-gray-400"
                    placeholder="laregionalesa\nom d'utilisateur"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-light-blue)]">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="7" r="3"/><path d="M2 18c0-3.5 6-5 8-5s8 1.5 8 5"/></svg>
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="rounded-md px-10 py-2 bg-[var(--background)] text-[var(--foreground)] border border-[var(--color-light-blue)] w-full placeholder:text-gray-400"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-light-blue)]">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="8" width="10" height="8" rx="2"/><path d="M12 12v2m-2-2v2"/></svg>
                  </span>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button
                type="submit"
                className="bg-[var(--color-golden-yellow)] text-[var(--color-dark-blue)] font-bold rounded-md py-2 mt-2 hover:brightness-95 transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin mr-2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /></svg>
                ) : null}
                Continuer
              </Button>
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-[var(--color-sky-blue)] hover:underline">Mot de passe oublié ?</a>
              </div>
            </form>
          </div>
          {/* Colonne droite : guide rapide */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-full min-h-[220px] rounded-2xl border border-[var(--color-sky-blue)] bg-[var(--background)] shadow flex flex-col items-center justify-center p-6">
              <span className="text-[var(--color-golden-yellow)] text-xl font-mrdafoe mb-2" style={{fontFamily: 'Micro 5, cursive'}}>Guide Rapide</span>
              <ul className="text-[var(--color-light-yellow)] text-sm list-disc pl-4 space-y-1">
                <li>Utilisez vos identifiants professionnels.</li>
                <li>Contactez l'admin en cas de problème d'accès.</li>
                <li>Accédez à vos workflows et agents en un clic après connexion.</li>
                <li>Découvrez notre robot IA en cliquant sur le bouton ci-dessus.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 