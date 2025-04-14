const showMenu = ($event) => {
  const menuButton = $event.srcElement
  const menuList = menuButton.nextSibling
  if (menuList && menuList.classList.contains('menu-list')) {
    const isOpen = menuList.style.display === 'block'
    menuList.style.display = isOpen ? '' : 'block'

    menuButton.classList.contains('menu-opened') ? menuButton.classList.remove('menu-opened') : menuButton.classList.add('menu-opened')

    if (!isOpen) {
      const handleOutsideClick = (e) => {
        if (!menuList.contains(e.target) && !menuButton.contains(e.target)) {
          menuList.style.display = ''
          menuButton.classList.remove('menu-opened')
          document.removeEventListener('pointerdown', handleOutsideClick)
        }
      }

      setTimeout(() => {
        document.addEventListener('pointerdown', handleOutsideClick)
      }, 0)
    }
  }

  const nestedMenuList = Array.from(menuList.children).filter((child) =>
    child.classList.contains('has-nested-menu'),
  )

  nestedMenuList.forEach((menuItem) => {
    if (menuItem.dataset.listenersAdded === 'true') return

    const submenu = menuItem.querySelector('.menu-list')

    menuItem.addEventListener('mouseenter', () => {
      if (submenu) submenu.style.display = 'block'
    })

    menuItem.addEventListener('mouseleave', () => {
      if (submenu) submenu.style.display = 'none'
    })

    menuItem.dataset.listenersAdded = 'true'
  })
}

export default showMenu
