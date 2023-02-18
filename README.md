## First start

In this repository I will discuss about

- How to define the basic router information in this project ?
- How to use lazy loading in react-router and customize it ?
- How to use Suspense to create loading page for loading process ?
- How to validate a route ?
- How to protect a route ?

For more information about this project.

1. You can read detail about advanced structure of Vite + React + TS project in this [repository](https://github.com/anhchangvt1994/vite-project--template-react-ts).
2. You can read about react-router in [here](https://reactrouter.com/en/main).

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

You can protect route by using the [meta options and use beforeEach event to execute it](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields).
We will make an example in this project. The PRD for protect route's case has some short description.

```markdown
// PRD - Comment Page

**Description**

- Comment Page is the page contains full list of comments.
- The user can enter Comment Page with two ways:

1. Click "See more" from comment section in Content Page.
2. copy and paste the url of Comment Page in browser's url bar.

**Accessible rules**
To access Comment Page user must:

- Already logged

If user haven't logged before, the system will auto redirect user to Login Page.

If user have an account before, user will logged with that account, and after login success, the system will redirect user back to Comment Page.

If user does not have an account before, user can go to Register Page and regist an account. After regist success, the system will auto login and redirect user go to Comment Page.
```

You will have many choice to resolve for above PRD

1. Use React Hook and Store (easy way to handle but never easy way to manage)

- Router load Comment Page finish
- Comment Page's hook actived
- Check access rule. If invalid then store current path and redirect to Login Page
- Login success redirect back to Comment Page path stored and remember clear that store's path variable.

2. Use only react-router (harder to implement but easy to use and manage)

- Setup **handle { protect() {... return boolean | string} }** and execute it in **RouterProtection** render-less.
- If **protect()** return invalid, then the system will auto check if Comment Page need to back after success verify, then save the path of Comment Page, and redirect user to Login Page.
- Login success redirect back to Comment Page.

In this project, I will show you the second solution. Cause we just focus only react-router in this project, and cause redirect is a part of router's cases, so doesn't need use store and hook to resolve it.

I handled for you executing **protect()** in this project, so you just only focus how to use it easy way. See code below

```javascript
// router/index

// Init RouterProtection with WAITING_VERIFY_ROUTER_ID_LIST
const WAITING_VERIFY_ROUTER_ID_LIST: { [key: string]: Array<string> } = {
  [import.meta.env.ROUTER_COMMENT_ID]: [import.meta.env.ROUTER_LOGIN_ID],
}

{
  path: import.meta.env.ROUTER_BASE_PATH,
  element: (
    <RouterInit>
      ...
        <RouterProtection
          WatingVerifyRouterIDList={WAITING_VERIFY_ROUTER_ID_LIST}
        >
          <Layout />
        </RouterProtection>
      ...
    </RouterInit>
  ),
}

// Config Protect method
{
  id: import.meta.env.ROUTER_COMMENT_ID,
  path: import.meta.env.ROUTER_COMMENT_PATH,
  element: withLazy(() => import('pages/CommentPage')),

  handle: {
    protect(certInfo) {
      /**
       * certInfo param contains
       * {
       *    user: {email?: string}
       *    navigateInfo: {to: RouteLocationNormalized, from: RouteLocationNormalized}
       *    successPath: string
       * }
       */
      const userInfo = certInfo?.user

      if (!userInfo || !userInfo.email)
        return import.meta.env.ROUTER_LOGIN_PATH

      return true
    },
  },
},
{
  id: import.meta.env.ROUTER_LOGIN_ID,
  path: import.meta.env.ROUTER_LOGIN_PATH,
  element: withLazy(() => import('pages/LoginPage')),
  handle: {
    protect(certInfo) {
      const userInfo = certInfo?.user

      if (userInfo && userInfo.email) {
        // NOTE - If logged > redirect to successPath OR previous path OR Home Page path

        return certInfo.successPath
          ? certInfo.successPath
          : certInfo.navigateInfo?.from
          ? certInfo.navigateInfo.from.fullPath
          : import.meta.env.ROUTER_HOME_PATH
      }

      return true
    },
  },
}, // Login Page
```

OK! You finish config protection for router, next I will show you how to use it

Imagine that you go to Comment Page without login, and the system redirect you to Login Page. This requirement are resolved by the above configuration.
In next step, in Login Page you click to login and after that the system has to redirect you go back Comment Page. This requirement are also resolved by the above configuration, but you must re-run the **protect()** in Login Page after login successfully. To do that, I have handled it and gave you a useful in API composition **useRoute** called **reProtect()**, all you need to do is just use it. See code below.

```javascript
// LoginPage.tsx
import { useUserInfo } from 'context/UserInfoContext'

const route = useRoute()
const { userInfo, setUserState } = useUserInfo()

const onClickLogin = () => {
	setUserState({ ...userInfo, email: 'abc@gmail.com' })

	// NOTE - remember use Optional chaining "?.". Thanks to ES6 useful
	// Because the system don't know what routes have protect and what routes don't have
	route.handle.reProtect?.()
}
```

And finish! You finish the requirement about login success with just 1 line of code.
But! wait minutes! We have an extensibility requirement

```markdown
// Logout rules
After login successfully
The "user's email" and "Logout" label will display in header at right corner

If user click "Logout" label

1. The system will logout account.
2. Next the system will check protect of current route.
3. If current route does not have protect rule or protect rule is valid,
   then do nothing.
4. If protect of current route return invalid,
   the system will redirect user to the verify route.
```

I think you have already known what need to do. Correct! just use **reProtect()** after logout. See code below.

```javascript
// Layout.tsx
import { useUserInfo } from 'context/UserInfoContext'

const route = useRoute()
const { userState, setUserState } = useUserInfo()

const onClickLogout = () => {
	setUserState({ ...userState, email: '' })

	// NOTE - remember use Optional chaining "?.". Thanks to ES6 useful
	// Because the system don't know what routes have protect and what routes don't have
	route.handle.reProtect?.()
}
```

Finish him! Easy to finish the extensibility requirement, jsut only 1 line of code.

**NOTE**

- Makesure your protect function is a **Pure Function**, it make your result will always right.
- You can customize or implement your logic to handle protect case by using

1. **config/router/utils/RouterProtection.ts** to customize or implement logic.
2. **config/router/index.ts** to init your handler.
