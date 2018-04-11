import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Row, Col, Input } from 'antd'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx.js'

import 'antd/dist/antd.css'
import 'prismjs/themes/prism-dark.css'
import './App.css'

window.React = React
window.ReactDOM = ReactDOM

const { TextArea } = Input
const aliases = {
  js: 'jsx',
  babel: 'jsx',
}

class App extends Component {
  state = {
    value: `
# Actually render your code blocks

This is my markdown file.

\`\`\`js
const value = 'Hey there!'
\`\`\`

What About babel?
-----------------

If you want to use babel, make sure to add babel-standalone like this file does at the top:
k

\`\`\`babel
class Demo extends React.Component {
  componentDidMount() {
    setInterval(() => this.forceUpdate(), 500)
  }
  render() {
    return <h1>This is cool times {Date.now()}</h1>
  }
}

ReactDOM.render(
  <Demo/>,
  DOM_NODE
)
\`\`\`

Isn't that

- Cool
- Awesome
- Incredibly inflexible?

Yes.`,
  }

  constructor(props) {
    super(props)

    this.md = new MarkdownIt({
      html: true,
      highlight: (str, lang) => {
        const highlightLang = aliases[lang]

        if (highlightLang && Prism.languages[highlightLang]) {
          const highlighedCode = Prism.highlight(
            str,
            Prism.languages[highlightLang],
          ).trim()

          if (lang === 'babel') {
            const uniqueId = `render-${Math.random()
              .toString(32)
              .substring(2)}`
            const script = `
              (function() { var DOM_NODE = document.getElementById("${uniqueId}");
                ${str}
              })()`
            import('@babel/standalone').then(Babel => {
              const transformedScript = Babel.transform(script, {
                presets: ['es2015', 'react'],
              }).code

              // console.log(transformedScript)
              // eval(transformedScript)
            })

            const finalHTML = `
                <div>${highlighedCode}</div>
                <div id="${uniqueId}" class="render-js"></div>
              `
            console.log(finalHTML)
            return finalHTML
          }

          return highlighedCode
        }

        return str
      },
    })
  }

  handleTextAreaChange = e => {
    this.setState({
      value: e.target.value.trim(),
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
              __html: this.md.render(this.state.value),
            }}
          />
        </Col>
      </Row>
    )
  }
}

export default App
