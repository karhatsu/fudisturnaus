import { useCallback, useState } from 'react'

const useForm = initialData => {
  const [formOpen, setFormOpen] = useState(!!initialData)
  const [data, setData] = useState(initialData || {})
  const [errors, setErrors] = useState([])

  const openForm = useCallback(initialData => {
    setData(initialData)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setErrors([])
  }, [])

  const changeValue = useCallback((field, value) => {
    setData(d => ({ ...d, [field]: value }))
  }, [])

  const changeValues = useCallback(values => {
    setData(d => ({ ...d, ...values }))
  }, [])

  const onFieldChange = useCallback(field => event => {
    setData(d => ({ ...d, [field]: event.target.value }))
  }, [])

  const onCheckboxChange = useCallback(field => event => {
    setData(d => ({ ...d, [field]: event.target.checked }))
  }, [])

  return {
    changeValue,
    changeValues,
    closeForm,
    data,
    errors,
    formOpen,
    onCheckboxChange,
    onFieldChange,
    openForm,
    setErrors,
  }
}

export default useForm
