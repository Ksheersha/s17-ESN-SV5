/**
 * Created by Yuxin Wei on 3/18/2017.
 */
module.exports = {
    development: {
  // db: 'mongodb://localhost:27017/FSE'
db: 'mongodb://ec2-52-204-117-72.compute-1.amazonaws.com:27017/FSE'

          },
    test: {

// db: 'mongodb://localhost:27017/FSE_TEST'
db: 'mongodb://ec2-52-204-117-72.compute-1.amazonaws.com:27017/FSE_TEST'


          },
    address: {
 URI:'https://emergency-social-network.herokuapp.com'
// URI:'http://localhost:3000'
// URI:'https://esntest.herokuapp.com'
        }
    };
