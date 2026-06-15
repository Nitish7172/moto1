import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export function useNavigateView() {
  const navigate = useNavigate()
  const goTo = useCallback((viewId) => {
    switch(viewId) {
      case 'home': return navigate('/')
      case 'accessories': return navigate('/accessories')
      case 'service': return navigate('/service')
      case 'about': return navigate('/about')
      default: return navigate('/')
    }
  }, [navigate])

  return { goTo }
}
