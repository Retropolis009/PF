import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState("Low")

  const API_URL = 'http://127.0.0.1:5000/api/tasks'
  const options = (method, body = null) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  })

  const loadTasks = () => {
    fetch(API_URL, options('GET')).then(res => res.json()).then(setTasks)
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    fetch(API_URL, options('POST', { text: input, priority })).then(() => {
      setInput(""); loadTasks()
    })
  }

  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, options('DELETE')).then(loadTasks)
  }

  useEffect(() => { loadTasks() }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
            Task Master
          </h1>
          <p className="text-slate-500 mt-2">Flask Session Storage + React</p>
        </header>

        {/* Responsive Form */}
        <form onSubmit={addTask} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-10 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
          <input 
            className="sm:col-span-2 bg-slate-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
          />
          <select 
            className="bg-slate-800 p-3 rounded-lg cursor-pointer outline-none"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95">
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 && <p className="text-center text-slate-600 italic">No tasks yet. Add one above!</p>}
          {tasks.map(task => (
            <div key={task.id} className="group flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium">{task.text}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                    task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-slate-500">{task.time}</span>
                </div>
              </div>
              
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App