## First start

In this repository I will discuss about

- How to define the basic router information in this project ?
- How to use lazy loading in react-router and customize it ?
- How to use Suspense to create loading page for loading process ?
- How to validate a route ?
- How to protect a route ?

For more information about this project.

1. You can read detail about advanced structure of Vite + React + TS project in this [repository](https://github.com/anhchangvt1994/vite-project--template-react-ts).
<<<<<<< HEAD
2. You can read about react-router in [here](https://reactrouter.com/en/main).
=======
2. You can read about react-router in [here](https://reactrouter.com/).
>>>>>>> ab16aed537b023df5055a5c2ae37f350a3136794

## Table of contents

1. [Install](#install)
2. [Introduction](#introduction)

<h2>Install</h2>

##### Expect Node 18.x or higher

Clone source with SSH url:

```bash
git clone https://github.com/anhchangvt1994/vite-project--template-react-ts__react-router
```

Install:

```bash
cd vite-project--template-react-ts__react-router
```

If use npm

```bash
npm install
```

If use yarn 1.x

```bash
yarn install
```

<h2>Introduction</h2>

### Table of benefit information that you must know

- [Define router information](#define)
- [lazy-loading](#lazy-loading)
- [Suspense](#Suspense)
- [Validate on route](#validate)
- [Protect on route](#protect)

<h3 id="define">Define router information</h3>
In this project, you can define router information in two ways

1. Immediacy

This way will fast and easy to define and create a react-router. See code below.

```jsx
// config/router/index.jsx
import Layout from 'Layout.jsx'
import HomePage from 'pages/HomePage.jsx'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        path: '/',
        element: <HomePage />,
      },
      ...
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: '/',
})
```

2. Define and use it by using environment variables

This way will make you spend more time to define and create react-router-dom. But other way you can reuse it to compare route's name, makesure right result when create route's path by using `<Link to={path} />` and more. See code below

```javascript
// env.router.mjs
export default {
  prefix: 'router',
  data: {
    base: {
      path: '/',
    },
    home: {
      id: 'HomePage',
      path: '/',
    },
    home: {
      id: 'ContentPage',
      path: '/:slugs',
    },
    ...
  },
}
```

```jsx
// config/router/index.jsx
import Layout from 'Layout.jsx'
import HomePage from 'pages/HomePage.jsx'

const routes = [
  {
    path: import.meta.env.ROUTER_BASE_PATH,
    element: <Layout />,
    children: [
      {
        index: true,
        path: import.meta.env.ROUTER_HOME_PATH,
        element: <HomePage />,
      },
      ...
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: '/',
})
```

```jsx
// HomePage.jsx
const pathInfo = generatePath(import.meta.env.ROUTER_CONTENT_PATH, {
	slugs: 'a-b-c-d-1234',
})

return <Link to={pathInfo}></Link>
```

Imagine that what happend if you use the first solution to create react-router-dom information and change a path. Are you sure that you changed all of them ?

<h3>lazy-loading</h3>

In react, it already introduced a simple way to create a lazy-loading by using dynamic import with [lazy](https://reactjs.org/docs/code-splitting.html#reactlazy) method. See code below and more about [lazy-loading route](https://www.positronx.io/react-lazy-loading-router-using-react-router-dom-tutorial/)

```jsx
// config/router/index.jsx
import Layout from 'Layout.jsx'

const HomePage = lazy(() => import('pages/HomePage.jsx'));

const routes = [
  {
    path: import.meta.env.ROUTER_BASE_PATH,
    element: <Layout />,
    children: [
      {
        index: true,
        path: import.meta.env.ROUTER_HOME_PATH,
        element: <HomePage />,
      },
      ...
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: '/',
})
```

<h3>Suspense</h3>

Suspense is a loading resolver solution. Imagine that your page is loading the HomePage resource (by using import dynamic on route) or await an API requesting, and your internet connection is so bad. Bumb! You see a blank page or a current page in so long of time, and that's the time you have to show a loading page or a skeleton.

In this section, I will discuss about handling the loading page when using lazy-loading routes.

Continue the problem above, we can resolve in two ways

1. Listen on Route and Listen on Hook
   Step by step like this

- When a route init or change, the Layout will re-render. I will turn on load in this event.
- When lazy-loading finish, the page component will active hooks. I will turn off loading screen at before logic code.

route init/change > Layout re-render > turn on loading screen > lazy-loading route finish > lifecycle hooks of page actived > turn off loading screen.

2. Use Suspense

In the first solution, we use router event and react hook + store to keep flag of on/off the loading screen. It means we have to :

- Define a isLoading flag in store.
- Define the turn on script in Layout.
- Define the turn of script in each page's hook.

I think that's run well, but not good for management.

In the second solution, we will use Suspense to resolve loading screen with better management. See code below.

```jsx
// config/router/index.jsx
import Layout from 'Layout.jsx'

const HomePage = lazy(() => import('pages/HomePage.jsx'));

const routes = [
  {
    path: import.meta.env.ROUTER_BASE_PATH,
    element: <Layout />,
    children: [
      {
        index: true,
        path: import.meta.env.ROUTER_HOME_PATH,
        element: <HomePage />,
      },
      ...
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: '/',
})
```

```jsx
import LoadingBoundary from 'utils/LoadingBoundary'
import LoadingPageComponent from 'components/LoadingPageComponent'

function Layout() {
	const location = useLocation()
	return (
		<div className="layout">
			<LoadingBoundary
				key={location.pathname}
				delay={150}
				fallback={<LoadingPageComponent />}
			>
				<Outlet />
			</LoadingBoundary>
		</div>
	)
} // App()

export default Layout
```

Easy! And you're finish him. You created loading screen in just two files instead of multiples files like the first solution.

NOTE: The `<Suspense></Suspense>` tag is already add into `<LoadingBoundary></LoadingBoundary>` used to custom delay time to show loading screen. If you need to know more about this customization, you can search on `LoadingBoundary`.

<h3 id="validate">Validate on route</h3>

You can use regex to validate route in **react-router v5**, See code below

```javascript
// /a-b-c-d-e1234 -> wrong
// /a-b-c-d-1234 -> right
{
	path: '/:slugs([a-zA-Z]-(\\d+$))'
}
```

That really cool feature! But this feature was [removed in react-router v6](https://reactrouter.com/en/main/start/faq#what-happened-to-regexp-routes-paths). So, you can't use regex to validate on route, instead that you can create a new hook for resolve the nesscessary of validation.

In this project, I already create and integrate that hook for you. See code below, and readmore about inline comment in code.

```javascript
{
  path: import.meta.env.ROUTER_CONTENT_PATH,
  element: withLazy(() => import('pages/ContentPage')),
  handle: {
    // It means validate and split method is params's method
    params: {
      // p is shorthand of params
      // If p.slugs is a string, we can validate it. Else, it is an undefined we can pass it.
      validate(p) {
        if (typeof p.slugs === 'string') {
          // /a-b-c-d-e1234 -> go to not found page
          // /a-b-c-d-1234 -> go to target page
          return /[a-zA-Z-_.]+[a-zA-Z]-(\d+$)/.test(p.slugs)
        }

        return true
      },
      // split method is a solution using to sperarate params to small and detail params.
      // not same vue-router, react-router doesn't have multiple params define in each slash
      // vue-router: /:title-:id -> right
      // react-router: /:title-:id -> wrong
      // so, to split slugs params to detail params information, we have to custom it by handle.split.
      split(p) {
        return {
          slug: p.slugs?.match(/^[a-zA-Z-_.]+[a-zA-Z]/)?.[0],
          id: p.slugs?.match(/\d+$/)?.[0],
        }
      },
    }
  },
```

Tada! it's finish!

As you can see, in react you must know more than and do more than, to create helpful utils and hooks for your project. But in this project the react-router looks like more simple.

<h3 id="protect">Protect on route</h3>

You can protect route by using the **handle.protect method**.
Imagine that you have a route only allow V.I.P user, then you need to prevent other user enter that V.I.P route. In this case you can use protect route to resolve it. See code below

```javascript
{
  path: import.meta.env.ROUTER_CONTENT_PATH,
  element: withLazy(() => import('pages/ContentPage')),
  handle: {
    protect() {
      const userInfo = useUserInfo()
      return userInfo.isVip
    }
  },
```

Makesure your protect function is a **Pure Function**, it make your result will always right.
