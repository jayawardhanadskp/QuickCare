import { useRef } from 'react'
import toast from 'react-hot-toast'
import { Camera, Trash2 } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

// Shrink the chosen image to a small square so it stays light in the database
const resize = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size = 200
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      // crop the middle part so the picture is not stretched
      const side = Math.min(img.width, img.height)
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => reject(new Error('bad image'))
    img.src = URL.createObjectURL(file)
  })

// Upload, change or remove my profile picture
export default function PictureUpload() {
  const { user, updateUser } = useAuth()
  const fileInput = useRef()

  const save = async (avatar) => {
    try {
      const { data } = await api.put('/auth/me', { avatar })
      updateUser(data)
      toast.success(avatar ? 'Picture updated' : 'Picture removed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save picture')
    }
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file')
    try {
      await save(await resize(file))
    } catch {
      toast.error('Could not read that image')
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={user.name} src={user.avatar} size={80} />
      <div className="flex flex-wrap gap-2">
        <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button type="button" className="btn-outline !py-1.5" onClick={() => fileInput.current.click()}>
          <Camera size={16} /> {user.avatar ? 'Change picture' : 'Upload picture'}
        </button>
        {user.avatar && (
          <button type="button" className="btn-outline !py-1.5 !text-red-600" onClick={() => save('')}>
            <Trash2 size={16} /> Remove
          </button>
        )}
      </div>
    </div>
  )
}
