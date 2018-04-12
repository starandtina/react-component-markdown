import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, Row, Col, Input } from 'antd'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx.js'

import 'antd/dist/antd.css'
import 'prismjs/themes/prism-dark.css'
import './App.css'

window.Button = Button
window.React = React
window.ReactDOM = ReactDOM

const { TextArea } = Input
const aliases = {
  js: 'jsx',
  babel: 'jsx'
}
const initValue = `
# Markdown

## Use JS code block

\`\`\`js
const value = 'Hey there!'
\`\`\`

## What About \`babel\`?

\`\`\`babel
class Demo extends React.Component {
  handleButtonClick = () => {
    setInterval(() => this.forceUpdate(), 500)
  }
  
  render() {
    return (
      <div>
        <Button type='primary' onClick={this.handleButtonClick}>Start the timer</Button>
        <h1>{Date.now()}</h1>
      </div>
    )
  }
}

ReactDOM.render(
  <Demo/>,
  DOM_NODE
)
\`\`\`

**Awesome!**`
class App extends Component {
  state = {
    value: ''
  }

  constructor(props) {
    super(props)

    this.md = new MarkdownIt({
      html: true,
      highlight: (str, lang) => {
        if (!lang) {
          return str
        }

        const highlightLang = aliases[lang]

        if (highlightLang && Prism.languages[highlightLang]) {
          const highlighedCode = Prism.highlight(str, Prism.languages[highlightLang]).trim()

          if (lang === 'babel') {
            const uniqueId = `render-${Math.random()
              .toString(32)
              .substring(2)}`

            import('@babel/standalone').then(Babel => {
              const script = `
              (function() { var DOM_NODE = document.getElementById("${uniqueId}");
                ${str}
              })()`
              try {
                const transformedScript = Babel.transform(script, {
                  presets: ['es2015', 'react', 'stage-0']
                }).code

                eval(transformedScript)
              } catch (err) {
                console.error(err)
              }
            })

            return `
                <div>${highlighedCode}</div>
                <div id="${uniqueId}" class="render-js"></div>
              `
          }

          return highlighedCode
        }

        return str
      }
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: initValue.trim()
      })
    })
  }

  handleTextAreaChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    // console.log(this.md.render(this.state.value))
    return (
      <Row gutter={16}>
        <Col xs={12}>
          <TextArea
            rows={40}
            cols={100}
            value={this.state.value}
            onChange={this.handleTextAreaChange}
          />
        </Col>
        <Col xs={12}>
          <div
            dangerouslySetInnerHTML={{
              __html: this.md.render(this.state.value)
            }}
          />
        </Col>
      </Row>
    )
  }
}

export default App
