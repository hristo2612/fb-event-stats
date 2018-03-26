var Nightmare = require('nightmare')
var nightmare = Nightmare({ show: true })
var eventPage = `https://www.facebook.com/events/2043052909267896/` // REPLACE WITH the fb event you need to crawl here..
var smallEvent = true
var maxWaitScroll = 15000 // IF you don't scroll to the bottom of the list, replace with 29997 FOR MAXIMUM POWER
var chalk = require('chalk');

console.log(chalk.green('Hey There Welcome to fb Event stats!'));

nightmare
  .goto(eventPage)
  .wait(2000)
  .type('[type=email]', 'YOUR_EMAIL_HERE') // REPLACE WITH YOUR FACEBOOK EMAIL or phone number
  .type('[type=password]', 'YOUR_PASS_HERE') // REPLACE WITH YOUR PASSWORD
  .click('[type=submit]')
  .wait(2600)
  .goto(eventPage)
  .wait(2600)
  .evaluate(function() {
    document.querySelector('._5z74').click()
    return "Clicked on Events Popup (this will open and scroll to the bottom of all the people who are GOING ( Excluding Interested )"
  })
  // .wait(2000) // UNCOMMENT
  // .evaluate(function() {  // THIS PART TO GET THE STATS
  //   document.querySelector('._3e7x').firstChild.firstChild.click() // FOR ALL THE INTERESTED
  //   return "Clicked on interested events" // PEOPLE
  // })
  .wait(4200) // TODO: think of a way to remove WAITING SO GOD DAMN LONG
  .evaluate(function() {
    var scrollable = document.querySelectorAll('.uiScrollableAreaWrap')[2]
    var count = 0;
    var interval = setInterval(function(){
      scrollable.scrollTop += 4200
      count += 1
      console.log(count)
      if ( count >= 29) {
        clearInterval(interval)
      }
    }, 1000)

    return scrollable.scrollTop
  })
  .wait(maxWaitScroll) // TODO: think of a better way to crawl all the events instead of waiting ( WAITING SO GOD DAM LONG )
  .evaluate(function() {
    var elm = document.querySelectorAll('.uiScrollableAreaContent')[2] // TODO: find a better selector
    var html = elm.innerHTML
    var list = []
    var numOfGirls = 0
    var regext = /class="_h24 _h25">(.*?){4,42}</g
    var found = html.match(regext)
    found.forEach(function(name){

      var stripName = name.replace('class="_h24 _h25">', '')
      var re = /<\/span>(.*?)+/
      var finishedName = stripName.replace(re, '')
      if ( finishedName[finishedName.length - 1] === "a" || finishedName[finishedName.length - 1] === "а" ) {
        numOfGirls ++ // this is a very nifty check for girl names ( Works for Slavic names as most of them end in 'a' )
      }
      list.push(finishedName)

    })
    var girlPercent = (( numOfGirls / list.length ) * 100) + "%"
    return { girlPercent, numOfGirls, total: list.length } 
  })
  .then(function(result) {
    console.log(chalk.cyan("Going to the Event:"))
    console.log(chalk.yellow("№ of Slavic Girls :D --> "), chalk.magenta(result.numOfGirls), chalk.green(" out of "), chalk.blue(result.total), chalk.green(" people"))
    console.log(chalk.yellow("% of Slavic Girls XD --> "), chalk.magenta(result.girlPercent))
  })
  .catch(function(error) {
    console.error('Something failed, not good man:', error)
  })