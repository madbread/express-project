module.exports = {
  'port': process.env.PORT || 1919,
  'db_local': 'mongodb://localhost/madbreadband',
  'db_remote': 'mongodb://madbread:dailydose19@ds047901.mongolab.com:47901/madbreadband',
  'db_options': { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                 replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } },
  'secret':  'slatronica',
  'env': 'mongo'
}
