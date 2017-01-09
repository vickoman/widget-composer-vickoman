import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import WidgetEditorView from '../views/WidgetEditorView'
import WidgetEditorPreview from '../views/WidgetEditorPreview'
import ContentManagerView from '../views/ContentManagerView'
import WidgetPhantomPreview from '../views/WidgetPhantomPreview'
import WidgetDevelopPreview from '../views/WidgetDevelopPreview'
import PageNotFound from '../views/PageNotFound'
import KnowblyDesignView from '../views/KnowblyDesignView'
import LoginView from '../views/LoginView'

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/login',
            component: LoginView,
            name: 'loginView'
        },
        {
            path: '/logout',
            meta: { 
                requiresAuth: true,
                roles: ['super-admin', 'admin', 'edit', 'reviewer']
            }
        },
        { 
            path: '/content-manager',
            component:ContentManagerView, 
            name:'contentManagerView',
            meta: { 
                requiresAuth: true,
                roles: ['admin', 'edit', 'reviewer']
            }
        },
        { 
            path: '/widget-editor/:id', 
            component: WidgetEditorView, 
            name:'editor', 
            meta: { 
                requiresAuth: true,
                roles: ['admin', 'edit', 'reviewer']
            } 
        },
        { 
            path: '/widget-editor/:id/preview', 
            component: WidgetEditorPreview, 
            name:'preview', 
            meta: { 
                requiresAuth: true,
                roles: ['admin', 'edit', 'reviewer']
            } 
        },
        { 
            path: '/widget-editor/:id/preview/phantom', 
            component: WidgetPhantomPreview, 
            name:'phantom', 
            meta: { 
                requiresAuth: true,
                roles: ['admin']
            } 
        },
        { 
            path: '/widget-editor/:id/preview/develop', 
            component: WidgetDevelopPreview, 
            name:'develop', 
            meta: { 
                requiresAuth: true,
                roles: ['admin', 'edit', 'reviewer']
            } 
        },
        { 
            path: '/design', 
            component: KnowblyDesignView, 
            name:'design', 
            meta: { 
                requiresAuth: true,
                roles: ['admin', 'edit', 'reviewer']
            } 
        },
        { 
            path: '/not-found', 
            component: PageNotFound, 
            name:'notFound'
        },
        { 
            path: '*', 
            redirect: '/content-manager' 
        },
    ]
})
