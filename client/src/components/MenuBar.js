import React, { useState } from 'react'
import { Menu, Segment } from 'semantic-ui-react'

function MenuBar() {
  const [activeItem,setActiveItem ] = useState('home');

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='messages'
            active={activeItem === 'messages'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='friends'
            active={activeItem === 'friends'}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>

        <Segment>
          <img src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
        </Segment>
      </div>
    )
}

export default MenuBar;