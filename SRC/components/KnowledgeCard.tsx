import { Card, CardContent } from '@/components/ui/card'
import { KnowledgePoint, THEME_CONFIG } from '@/lib/data'
import { MasteryBadge } from './MasteryBadge'
import { motion } from 'framer-motion'
import { VideoCamera } from '@phosphor-icons/react'

interface KnowledgeCardProps {
  point: KnowledgePoint
  onClick: () => void
}

export function KnowledgeCard({ point, onClick }: KnowledgeCardProps) {
  const themeConfig = point.theme ? THEME_CONFIG[point.theme] : null

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
          <div className="flex items-center justify-between gap-1">
            {themeConfig && (
              <span 
                className="text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded-full border"
                style={{ 
                  color: themeConfig.color,
                  borderColor: themeConfig.color,
                  backgroundColor: `color-mix(in oklch, ${themeConfig.color} 10%, transparent)` 
                }}
              >
                {themeConfig.icon} {themeConfig.label}
              </span>
            )}
            <div className="flex items-center gap-1">
              {point.videoLink && (
                <VideoCamera className="text-primary/60" size={14} weight="bold" />
              )}
              <MasteryBadge mastery={point.mastery} />
            </div>
          </div>
          <h3 className="font-semibold text-sm md:text-base leading-tight line-clamp-3 md:line-clamp-2">
            {point.title}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  )
}
