const DEFAULT_BANNER = [
  '1ejAOSahrXGUlha5WgMEws9cnN0-oVse-',
  '15PjVU50cS85litL7bjGboreSal2trP91',
  '12DKIenkOU3XMUpgwQQ79q2bbf_2WX6Se',
  '19MSB7YhJ8bBkUOXIRXrdi1eVl40URzLf'
]
const DEFAULT_THUMBNAIL = [
  '1a-28ektFpcYNf7q09XBZpz2aTfZci8JT',
  '1gvxhHZV7oCdQrpqgA91JUoiwK7GYOnHp',
  '1YF1Ul1dBCEmOnLL4t4CFdx4VR5J9VKfC',
  '1lxg1D49NnZsYfhxl6Xm-p_iOLEPds8KM'
]

const IMAGE_TYPE = {
  BANNER: 0,
  THUMBNAIL: 1
}

const getRandomImage = () => {
  const random  = Math.floor(Math.random() * DEFAULT_BANNER.length)
  return {
    banner: DEFAULT_BANNER[random],
    thumbnail: DEFAULT_THUMBNAIL[random]
  }
}

module.exports = {
  getRandomImage: getRandomImage,
  IMAGE_TYPE: IMAGE_TYPE
}