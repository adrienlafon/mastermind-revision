/**
 * LoginScreen.tsx — Écran de connexion / inscription.
 *
 * Formulaire double mode :
 * - Connexion : login + mot de passe
 * - Inscription : login + mot de passe (le premier inscrit devient admin)
 *
 * Appelle l'API /api/auth/login ou /api/auth/register.
 */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Brain, SignIn } from '@phosphor-icons/react'
import { useAuthStore } from '@/lib/auth-store'

export function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const authLogin = useAuthStore(s => s.login)
  const authRegister = useAuthStore(s => s.register)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!login.trim() || !password) {
        setError('Pseudo et mot de passe sont obligatoires.')
        return
      }
      if (isRegister) {
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.')
          return
        }
        await authRegister(login.trim(), password)
      } else {
        await authLogin(login.trim(), password)
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 md:space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3 md:mb-4">
            <Brain className="text-white" size={28} weight="bold" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">MasterMind</h1>
          <p className="text-muted-foreground mt-2">
            Révisez et maîtrisez les 70 techniques de JJB
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isRegister ? 'Créer un compte' : 'Se connecter'}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? 'Créez votre espace personnel de révision'
                : 'Accédez à votre espace personnel'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Pseudo</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="MonPseudo"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <SignIn className="mr-2" weight="bold" />
                {isRegister
                  ? (isSubmitting ? 'Création...' : 'Créer mon compte')
                  : (isSubmitting ? 'Connexion...' : 'Se connecter')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                {isRegister
                  ? 'Déjà un compte ? Se connecter'
                  : 'Pas encore de compte ? S\'inscrire'}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Le premier utilisateur inscrit devient automatiquement administrateur.
        </p>
      </div>
    </div>
  )
}
