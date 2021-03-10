import React, { Component } from 'react'
import EditorJs from 'react-editor-js'
import paragraph from '@editorjs/paragraph'
import ImageTool from '@editorjs/image'

const tools = {
  paragraph,
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: '/api/upload',
      },
    },
  },
}

export default class Editor extends Component {
  async handleSave() {
    await this.editorInstance.save()
  }

  render() {
    return (
      <>
        <button onClick={this.handleSave.bind(this)}>Save</button>
        <EditorJs
          tools={tools}
          instanceRef={(instance) => (this.editorInstance = instance)}
        />
      </>
    )
  }
}
