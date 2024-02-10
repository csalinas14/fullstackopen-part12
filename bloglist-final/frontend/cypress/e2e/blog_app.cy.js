describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'cypress_tester',
      name: 'SuperUser',
      password: 'apple'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form can be shown', function() {
    cy.contains('username')
    cy.contains('password')
    //cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('cypress_tester')
      cy.get('#password').type('apple')
      cy.get('#login-button').click()

      cy.contains('SuperUser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong_tester')
      cy.get('#password').type('not correct password')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'SuperUser logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'cypress_tester', password: 'apple' })
      cy.createBlog({ title: 'first cypress test blog', author: 'beforeEachCode', url: 'www.beforeEachUrl.com' })
    })

    it('a new blog can be created', function() {
      //console.log('testing')
      //cy.contains('SuperUser logged in')
      cy.contains('new blog').click()
      cy.get('#blogFormTitle').type('can a new blog be created with cypress?')
      cy.get('#blogFormAuthor').type('nobody')
      cy.get('#blogFormUrl').type('www.testingLocalHost.com')
      cy.get('#blogFormCreateButton').click()

      //cy.contains('can a new blog be created with cypress?')
      cy.get('.blog').filter(':contains("can a new blog be created with cypress?")')

    })

    it('a user can like a blog', function() {
      cy.get('.blog').filter(':contains("first cypress test blog")')
        .contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
      cy.contains('likes 0').should('not.exist')
    })

    it('a user can delete their blog', function() {
      cy.get('.blog').filter(':contains("first cypress test blog")').as('currentBlog')
      cy.get('@currentBlog').contains('view').click()
      cy.get('@currentBlog').contains('delete').click()

      cy.contains('first cypress test blog').should('not.exist')
    })

    it('creator can only see the delete button and no one else', function() {
      cy.createBlog({ title: 'cypress_tester should see delete', author: 'deleteButtonTester', url: 'www.test.com' })
      cy.get('.blog').filter(':contains("cypress_tester should see delete")').as('currentBlog')
      cy.get('@currentBlog').contains('view').click()
      cy.get('@currentBlog').contains('delete')

      cy.createUser({ username: 'deleteButtonTest', name: 'Tester', password: 'test' })
      cy.logout()
      cy.login({ username: 'deleteButtonTest', password: 'test' })

      cy.get('@currentBlog').contains('view').click()
      //cy.get('.blog').filter(':contains("cypress_tester should see delete")').contains('delete').should('not.exist')
      cy.get('@currentBlog').find('button').then( buttons => {
        //console.log(buttons)
        cy.wrap(buttons.slice(-1)[0]).parent().should('have.css', 'display', 'none')
      })
      cy.get('@currentBlog').get('.blogLikeButton')
    })

    it('blog list is in order', function() {
      cy.createBlog({ title: 'most liked blog', author: 'hitAuthor', url: 'www.times.com', likes: 9999 })
      cy.createBlog({ title: 'middle liked blog', author: 'decentAuthor', url: 'www.theonion.com', likes: 5 })
      cy.createBlog({ title: 'add one to pass cypress tester to pass this', author: 'notgood', url: 'www.no.com' })

      cy.get('.blog').eq(0).should('contain', 'most liked blog')
      cy.get('.blog').eq(1).should('contain', 'middle liked blog')

      cy.get('.blog').eq(2).should('contain', 'first cypress test blog')
      cy.get('.blog').eq(3).contains('view').click()
      cy.get('.blog').eq(3).contains('like').click()

      cy.get('.blog').eq(2).should('contain', 'add one to pass cypress tester to pass this')

    })
  })

})