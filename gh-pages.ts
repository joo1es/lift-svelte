import { publish } from 'gh-pages'

publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/joo1es/lift-svelte', // Update to point to your repository
        user: {
            name: 'Jooies', // update to use your name
            email: 'jooies@qq.com' // Update to use your email
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!')
    }
)