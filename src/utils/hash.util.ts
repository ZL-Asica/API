const generateHash = async (input: Uint8Array): Promise<string> => {
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', input)
    const hashArray = [...new Uint8Array(hashBuffer)]
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    console.error('Error during hashing:', error)
    throw new Error('Failed to generate hash')
  }
}

export default generateHash
