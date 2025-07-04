import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface ButtonSubmitProps {
  isLoading: boolean
  text: string
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ isLoading, text }) => {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        text
      )}
    </Button>
  )
}

export default ButtonSubmit
