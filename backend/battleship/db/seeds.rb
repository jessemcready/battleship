# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'

User.destroy_all
Ship.destroy_all

puts "creating users"
User.create([
  {name: 'Anakin Skywalker', win: 0, loss: 0, turn: false},
  {name: 'Luke Skywalker', win: 0, loss: 0, turn: false}
])
puts "creating users"

puts "creating ships"
Ship.create([
  {name: 'Millennium Falcon', side: 'rebels', size: 5, user_id: User.last.id},
  {name: 'Tantive IV', side: 'rebels', size: 4, user_id: User.last.id},
  {name: 'X-Wing', side: 'rebels', size: 3, user_id: User.last.id},
  {name: 'Republic Attack Gunship', side: 'rebels', size: 3, user_id: User.last.id},
  {name: 'Anakins Podracer', side: 'rebels', size: 2, user_id: User.last.id},
  {name: 'Death Star', side: 'empire', size: 5, user_id: User.first.id},
  {name: 'Imperial Star Destroyer', side: 'empire', size: 4, user_id: User.first.id},
  {name: 'Tie Fighter', side: 'empire', size: 3, user_id: User.first.id},
  {name: 'Imperial Shuttle', side: 'empire', size: 3, user_id: User.first.id},
  {name: 'AT-ST Walker', side: 'empire', size: 2, user_id: User.first.id}
])
puts "done creating ships"
