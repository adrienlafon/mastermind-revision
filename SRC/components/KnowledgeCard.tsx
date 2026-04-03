import { Card, CardContent } from '@/components/ui/card'
import { KnowledgePoint } from '@/lib/data'
import { MasteryBadge } from './MasteryBadge'
import { motion } from 'framer-motion'

interface KnowledgeCardProps {
  point: KnowledgePoint
  onClick: () => void
}

export function KnowledgeCard({ point, onClick }: KnowledgeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer h-full hover:shadow-lg transition-shadow duration-200 border-2 hover:border-accent/50"
        onClick={onClick}
      >
        <CardContent className="p-3 md:p-4 flex flex-col gap-2 md:gap-3 h-full">
          <div className="flex items-start justify-end gap-2">
            <MasteryBadge mastery={point.mastery} />
          </div>
          <h3 className="font-semibold text-sm md:text-base leading-tight line-clamp-3 md:line-clamp-2">
            {point.title}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  )
}
