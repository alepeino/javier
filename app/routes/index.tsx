import { useEffect } from 'react'
import { useNavigate } from 'remix'
import { dateInYMD } from '~/lib/date'

export default function RedirectToCurrentDate() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(`operaciones/${dateInYMD()}`)
  }, [navigate])
  return null
}
