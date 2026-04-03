export type MasteryLevel = 'weak' | 'progress' | 'mastered'

export interface KnowledgePoint {
  id: number
  title: string
  description: string
  mastery: MasteryLevel
  notes?: string
  videoLink?: string
}

export const INITIAL_KNOWLEDGE_POINTS: KnowledgePoint[] = [
  {
    id: 1,
    title: `Sortie de contrôle latéral 1/3 – Fuite de hanches`,
    description: `Lorsque vous êtes sous contrôle latéral, le véritable problème n’est pas le contrôle de votre torse mais celui de vos hanches. Tant que votre bassin est aligné avec celui de l’adversaire, vous êtes immobilisé mécaniquement. Installez deux frames solides avec vos avant‑bras contre son cou et sa hanche. Gardez les coudes serrés pour protéger vos bras. Poussez avec les pieds pour reculer vos hanches. Votre tête reste au sol pendant le mouvement. Cherchez uniquement à créer de l’espace. Utilisez cet espace pour faire entrer votre genou. Ce genou devient votre première barrière. Sans cette étape, toute poussée des bras sera inefficace.`,
    mastery: 'weak'
  },
  {
    id: 2,
    title: `Sortie de contrôle latéral 2/3 – Poids de l'adversaire en avant`,
    description: `Quand son poids est projeté vers votre tête, son centre de gravité devient instable. Utilisez un pont court vers lui pour amplifier ce déséquilibre. Dès qu’il compense, effectuez une fuite de hanches. Le timing prime sur la force. Vos frames maintiennent l’espace pendant la fuite. Déplacez toujours son poids avant le vôtre. Cherchez le genou côté hanche. Insérez-le immédiatement. Recréez ensuite la garde. Stabilisez avant toute transition.`,
    mastery: 'weak'
  },
  {
    id: 3,
    title: `Sortie de contrôle latéral 3/3 – Hanches de l'adversaire au sol`,
    description: `Avec des hanches basses, votre adversaire répartit bien son poids. Construisez votre frame côté hanche avant de bouger. Protégez votre cou avec l’autre bras. Reculer vos hanches jusqu’à voir son genou. C’est le repère de l’espace. Ramenez votre genou intérieur. Votre tibia devient un knee shield. Ne tentez pas de vous relever sans ce genou. Ramenez la seconde jambe. Recomposez votre garde.`,
    mastery: 'weak'
  },
  {
    id: 4,
    title: `Sortie nord-sud – Retour vers contrôle latéral`,
    description: `Depuis nord‑sud, tournez vers votre adversaire afin de protéger vos épaules. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 5,
    title: `Sortie de genou-poitrine – Retour vers demi-garde`,
    description: `Installez un frame sur son genou pour empêcher la pression sur le torse. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 6,
    title: `Sortie de montée 1/2 – Retour en demi-garde`,
    description: `Piégez sa cheville avec votre pied pour limiter sa base. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 7,
    title: `Sortie de montée 2/2 – Alternative vers garde fermée`,
    description: `Après le pont diagonal, profitez de l’espace entre ses genoux. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 8,
    title: `Défense de tortue 1/2 – Concepts et sortie Makikomi`,
    description: `En tortue, fermez les espaces entre coudes et genoux. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 9,
    title: `Défense de tortue 2/2 – Cas général`,
    description: `Ne restez jamais statique en tortue. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 10,
    title: `Sortie de dos 1/2 – Côté underhook`,
    description: `Descendez du côté où l’adversaire vous tient. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 11,
    title: `Sortie de dos 2/2 – Côté overhook`,
    description: `Contrôlez le bras d’étranglement au poignet. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 12,
    title: `Garde fermée 1/3 – Premiers concepts et prise de dos`,
    description: `Cassez la posture avant toute attaque. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 13,
    title: `Garde fermée 2/3 – Renversement Pendulum`,
    description: `Chargez son poids sur votre hanche. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 14,
    title: `Garde fermée 3/3 – Renversement Hip-Bump`,
    description: `Lorsque l’adversaire se redresse, asseyez-vous sur un coude. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 15,
    title: `Sortie de garde fermée – Concepts et passage`,
    description: `Redressez votre posture avant d’ouvrir. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 16,
    title: `Demi-garde torse contre torse – Sorties`,
    description: `Cherchez l’underhook du côté supérieur. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 17,
    title: `Demi-garde 1/2 – Concepts et premier renversement`,
    description: `Le combat principal est celui de l’underhook. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 18,
    title: `Demi-garde 2/2 – Renversements complémentaires`,
    description: `Si la jambe libre recule, adaptez l’angle. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 19,
    title: `Passage de demi-garde 1/2 – Concepts et désengagement`,
    description: `Installez une crossface pour orienter son regard. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 20,
    title: `Passage de demi-garde 2/2 – Knee cut`,
    description: `Alignez votre genou avec son épaule opposée. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 21,
    title: `Garde ouverte 1/5 – Rétention de garde`,
    description: `Gardez vos genoux entre vous et lui. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 22,
    title: `Garde ouverte 2/5 – Concepts et triangle`,
    description: `Isolez un bras et cassez la posture. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 23,
    title: `Garde ouverte 3/5 – Omoplata`,
    description: `Créez un angle avec vos hanches. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 24,
    title: `Garde ouverte 4/5 – DLR renversement latéral`,
    description: `Poussez la hanche et tirez la cheville. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 25,
    title: `Garde ouverte 5/5 – DLR Renversement Overhead`,
    description: `Soulevez avec vos deux jambes. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 26,
    title: `Passage de garde ouverte 1/2 – Concepts et première séquence`,
    description: `Contrôlez les chevilles avant d’entrer. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 27,
    title: `Passage de garde ouverte 2/2 – Lasso spider vers nord-sud`,
    description: `Contournez la ligne de hanches. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 28,
    title: `Debout 1/2 – Ankle Pick`,
    description: `Tirez vers l’avant avec le col. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 29,
    title: `Debout 2/2 – Tirage de garde`,
    description: `Connectez-vous avant de vous asseoir. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 30,
    title: `Contrôle latéral 1/2 – Concepts et transition vers la montée`,
    description: `Placez l’épaule dans la mâchoire. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 31,
    title: `Contrôle latéral 2/2 – Clé de bras`,
    description: `Isolez le coude de votre adversaire. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 32,
    title: `Nord-Sud 1/2 – Kimura`,
    description: `Éloignez son poignet du corps. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 33,
    title: `Nord-sud 2/2 – Paper cutter`,
    description: `Fermez votre coude au sol. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 34,
    title: `Montée 1/2 – Americana`,
    description: `Le poignet doit rester au sol. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 35,
    title: `Montée 2/2 – Clé de bras`,
    description: `Montez votre genou au-dessus de la tête. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 36,
    title: `Défense de clé de bras – Dessus et dessous`,
    description: `Connectez vos mains pour bloquer l’extension. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 37,
    title: `Tortue – Concepts et prises de dos`,
    description: `Contrôlez la ceinture autour des hanches. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 38,
    title: `Contrôle du dos 1/2 – Principes et étranglement côté underhook`,
    description: `Cachez la main qui étrangle. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 39,
    title: `Contrôle du dos 2/2 – Étranglement côté overhook`,
    description: `Serrez le coude de fermeture. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 40,
    title: `Triangle 1/2 – Concepts et entrée`,
    description: `Travaillez l’angle avant de fermer. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 41,
    title: `Triangle 2/2 – Ajustements et soumission`,
    description: `Amenez le genou vers le nez. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 42,
    title: `Défense de triangle 1/2 – Posture correcte`,
    description: `Gardez la tête haute. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 43,
    title: `Défense de triangle 2/2 – Mauvaise posture`,
    description: `Empilez vers l’avant. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 44,
    title: `Omoplata 1/2 – Concepts et soumission`,
    description: `Asseyez-vous pour finir. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 45,
    title: `Omoplata 2/2 – Réagir quand l'adversaire garde sa posture`,
    description: `Attrapez la hanche pour casser l’équilibre. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 46,
    title: `Défense d'omoplata 1/2 – Passage au dessus de l'adversaire`,
    description: `Levez-vous pour passer. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 47,
    title: `Défense d'omoplata 2/2 – Réaction tardive`,
    description: `Roulez pour extraire le bras. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 48,
    title: `DLR col-pantalon 1/2 – Renversement tripod`,
    description: `Poussez la hanche et tirez la cheville. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 49,
    title: `DLR col-pantalon 2/2 – Tripod vers SLX`,
    description: `Suivez la jambe capturée. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 50,
    title: `Passage de DLR 1/2 – Casser le grip au pantalon`,
    description: `Reculez pour casser le hook. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 51,
    title: `Passage de DLR 2/2 – Headquarter vers kneecut`,
    description: `Genou entre ses jambes. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 52,
    title: `Passage sous les jambes 1/2 – Miragaia`,
    description: `Soulevez les deux jambes. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 53,
    title: `Passage sous les jambes 2/2 – Réaction quand l'adversaire bloque`,
    description: `Changez d’angle immédiatement. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 54,
    title: `Défense de passage sous les jambes`,
    description: `Gardez les hanches lourdes. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 55,
    title: `Passage dans les jambes 1/2 – Over-under`,
    description: `Tête basse et avance. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 56,
    title: `Passage dans les jambes 2/2 – Bloc crossface`,
    description: `Replongez pour contrôler. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 57,
    title: `Défense Overunder 1/2 – Knee shield`,
    description: `Placez le tibia en bouclier. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 58,
    title: `Défense Overunder 2/2 – Arm Drag`,
    description: `Tirez le bras pour désaxer. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 59,
    title: `SLX 1/2 – Renversement de base`,
    description: `Genou ouvert et extension. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 60,
    title: `SLX 2/2 – Double pantalon`,
    description: `Tirez et poussez simultanément. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 61,
    title: `Défense SLX 1/2 – Backstep`,
    description: `Tournez au-dessus de la jambe. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 62,
    title: `Défense SLX 2/2 – Défense tardive`,
    description: `Écartez son genou. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 63,
    title: `X-Guard 1/2 – Relevé en base`,
    description: `Soulevez pour mettre la main au sol. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 64,
    title: `X-Guard 2/2 – Renversement en tripode`,
    description: `Levez la cheville ciblée. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 65,
    title: `Défense X-Guard 1/2 – High Step`,
    description: `Passez le genou haut. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 66,
    title: `Défense X-Guard 2/2 – Backstep`,
    description: `Pivotez pour sortir. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 67,
    title: `De La Riva inversée 1/2 – Recomposition`,
    description: `Gardez le hook actif. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 68,
    title: `De La Riva inversée 2/2 – Single Leg`,
    description: `Attrapez la jambe pour monter. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 69,
    title: `Garde 50/50 – Passage de base`,
    description: `Contrôlez son genou. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  },
  {
    id: 70,
    title: `Demi-garde profonde – Passage`,
    description: `Écrasez la hanche adverse. Votre priorité est de protéger vos coudes et votre cou. Installez des grips pour contrôler le membre dangereux. Utilisez vos pieds pour générer le mouvement. Cherchez à déplacer son centre de gravité avant le vôtre. Travaillez toujours l’angle plutôt que la force. Insérez un genou dès que l’espace apparaît. Connectez vos hanches à sa jambe. Verrouillez une position de transition stable. Stabilisez avant d’attaquer. Respirez et progressez sans précipitation.`,
    mastery: 'weak'
  }
]

export interface Category {
  id: number
  name: string
  description: string
  color: string
  icon: string
  pointIds: number[]
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Sorties de contrôle',
    description: 'Échapper aux positions dominantes',
    color: 'oklch(0.65 0.19 25)',
    icon: 'shield',
    pointIds: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 2,
    name: 'Défense de tortue & dos',
    description: 'Défenses depuis la tortue et le contrôle du dos',
    color: 'oklch(0.60 0.20 300)',
    icon: 'lock',
    pointIds: [8, 9, 10, 11]
  },
  {
    id: 3,
    name: 'Garde fermée',
    description: 'Attaques et renversements depuis la garde fermée',
    color: 'oklch(0.65 0.17 155)',
    icon: 'target',
    pointIds: [12, 13, 14, 15]
  },
  {
    id: 4,
    name: 'Demi-garde',
    description: 'Jeu offensif et défensif en demi-garde',
    color: 'oklch(0.70 0.15 60)',
    icon: 'split',
    pointIds: [16, 17, 18, 19, 20]
  },
  {
    id: 5,
    name: 'Garde ouverte',
    description: 'Rétention, attaques et DLR depuis la garde ouverte',
    color: 'oklch(0.55 0.18 280)',
    icon: 'web',
    pointIds: [21, 22, 23, 24, 25, 26, 27]
  },
  {
    id: 6,
    name: 'Debout & Takedowns',
    description: 'Travail debout et amenées au sol',
    color: 'oklch(0.50 0.15 200)',
    icon: 'standing',
    pointIds: [28, 29]
  },
  {
    id: 7,
    name: 'Contrôle & soumissions top',
    description: 'Contrôle latéral, nord-sud, montée et soumissions',
    color: 'oklch(0.45 0.15 240)',
    icon: 'crown',
    pointIds: [30, 31, 32, 33, 34, 35]
  },
  {
    id: 8,
    name: 'Défense de soumissions',
    description: 'Défenses de clé de bras, triangle, omoplata',
    color: 'oklch(0.60 0.12 140)',
    icon: 'shield-check',
    pointIds: [36, 42, 43, 46, 47]
  },
  {
    id: 9,
    name: 'Triangle & Omoplata',
    description: 'Attaques triangle et omoplata',
    color: 'oklch(0.58 0.16 340)',
    icon: 'triangle',
    pointIds: [40, 41, 44, 45]
  },
  {
    id: 10,
    name: 'Tortue offensive & dos',
    description: 'Prises de dos et étranglements',
    color: 'oklch(0.52 0.20 260)',
    icon: 'back',
    pointIds: [37, 38, 39]
  },
  {
    id: 11,
    name: 'DLR & Passages',
    description: 'De La Riva, passages et défenses',
    color: 'oklch(0.62 0.18 180)',
    icon: 'hook',
    pointIds: [48, 49, 50, 51, 52, 53, 54]
  },
  {
    id: 12,
    name: 'Over-under & Défenses',
    description: 'Passages dans les jambes et défenses',
    color: 'oklch(0.56 0.16 80)',
    icon: 'compress',
    pointIds: [55, 56, 57, 58]
  },
  {
    id: 13,
    name: 'SLX & X-Guard',
    description: 'Single leg X, X-Guard et défenses',
    color: 'oklch(0.48 0.14 320)',
    icon: 'x',
    pointIds: [59, 60, 61, 62, 63, 64, 65, 66]
  },
  {
    id: 14,
    name: 'Gardes inversées & 50/50',
    description: 'RDLR, 50/50 et demi-garde profonde',
    color: 'oklch(0.54 0.22 40)',
    icon: 'reverse',
    pointIds: [67, 68, 69, 70]
  }
]
