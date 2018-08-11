import React from "react"

export function Help() {
  return (
    <table className="bp3-html-table bp3-small .modifier">
      <thead>
        <tr>
          <th>Keymap</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ctrl + 1</td>
          <td>set-layout-1</td>
        </tr>
        <tr>
          <td>Ctrl + 2</td>
          <td>set-layout-2</td>
        </tr>
        <tr>
          <td>Ctrl + 3</td>
          <td>set-layout-3</td>
        </tr>
        <tr>
          <td>(Cmd / Ctrl) + S</td>
          <td>editor:save</td>
        </tr>
        <tr>
          <td>(Cmd / Ctrl) + Shift + S</td>
          <td>editor:commit-all</td>
        </tr>
      </tbody>
    </table>
  )
}
