const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs').promises;
const path=require('path')
const serve = require('koa-static');
const app = new Koa();
const router = new Router({prefix:'/api'});
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE=path.join(DATA_DIR, 'todos.json')
// Helper: ensure data file exists
async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch (err) {
    // If missing, write empty array
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

// Helper: read todos
async function readTodos() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
    return [];
  }
}
// Helper: write todos atomically
async function writeTodos(todos) {
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(todos, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}
function genId() {
  return Date.now().toString(36) + '-' + Math.floor(Math.random() * 10000).toString(36);
}

//获取所有todos
router.get('/todos', async (ctx) => {
  const todos = await readTodos();
  ctx.body = todos;
});
//创建todo
router.post('/todos', async (ctx) => {
  const { title,completed=false } = ctx.request.body;
  if(!title||typeof title!='string'){
    ctx.status=400
    ctx.body = { error: 'title is required and must be a string' };
    return;
  }
  const todos = await readTodos()
  const newTodos={
    id: genId(),
    title:title.trim(),
    completed,
    created_at: new Date().toISOString()
  };
  todos.push(newTodos);
  await writeTodos(todos);
  ctx.status = 201;
  ctx.body = newTodos;
});
//更新todo
router.put('/todos/:id', async (ctx) => {
  const { id } = ctx.params;
  const { title, completed } = ctx.request.body;
  
  const todos = await readTodos();
  const index = todos.findIndex(todo => todo.id === id);
  
  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Todo not found' };
    return;
  }
  
  if (title !== undefined) {
    todos[index].title = title.trim();
  }
  
  if (completed !== undefined) {
    todos[index].completed = Boolean(completed);
  }
  
  todos[index].updated_at = new Date().toISOString();
  
  await writeTodos(todos);
  ctx.body = todos[index];
});
//删除todo
router.delete('/todos/:id', async (ctx) => {
  const { id } = ctx.params;
  
  const todos = await readTodos();
  const index = todos.findIndex(todo => todo.id === id);
  
  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Todo not found' };
    return;
  }
  
  todos.splice(index, 1);
  await writeTodos(todos);
  ctx.status = 204;
});
//开启静态资源服务
app.use(serve(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
