import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Brain, SignIn, UserPlus } from '@phosphor-icons/react'
import { registerUser, loginUser, type UserInfo } from '@/lib/storage'

interface LoginScreenProps {
  onLogin: (user: UserInfo) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [login, setLogin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isRegister) {
        if (!login.trim() || !email.trim() || !password) {
          setError('Tous les champs sont obligatoires.')
          return
        }
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.')
          return
        }
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas.')
          return
        }

        const result = await registerUser(login.trim(), email.trim(), password)
        if (result.success && result.user) {
          onLogin(result.user)
        } else {
          setError(result.error ?? 'Erreur lors de l\'inscription.')
        }
      } else {
        if (!login.trim() || !password) {
          setError('Veuillez remplir tous les champs.')
          return
        }

        const result = await loginUser(login.trim(), password)
        if (result.success && result.user) {
          onLogin(result.user)
        } else {
          setError(result.error ?? 'Erreur lors de la connexion.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <Brain className="text-white" size={32} weight="bold" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MasterMind</h1>
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
                <Label htmlFor="login">
                  {isRegister ? 'Nom d\'utilisateur' : 'Identifiant ou email'}
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder={isRegister ? 'MonPseudo' : 'pseudo ou email'}
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete={isRegister ? 'username' : 'username'}
                />
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mon@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              )}

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

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isRegister ? (
                  <>
                    <UserPlus className="mr-2" weight="bold" />
                    {isSubmitting ? 'Création...' : 'Créer mon compte'}
                  </>
                ) : (
                  <>
                    <SignIn className="mr-2" weight="bold" />
                    {isSubmitting ? 'Connexion...' : 'Se connecter'}
                  </>
                )}
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
