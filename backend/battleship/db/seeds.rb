# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Ship.destroy_all

list = ['rebels', 'empire']

Ship.create([
  {type: 'carrier', side: 'rebels', size: 5},
  {type: 'battleship', side: 'rebels', size: 4},
  {type: 'cruiser', side: 'rebels', size: 3},
  {type: 'submarine', side: 'rebels', size: 3},
  {type: 'destroyer', side: 'rebels', size: 2},
  {type: 'carrier', side: 'empire', size: 5},
  {type: 'battleship', side: 'empire', size: 4},
  {type: 'cruiser', side: 'empire', size: 3},
  {type: 'submarine', side: 'empire', size: 3},
  {type: 'destroyer', side: 'empire', size: 2}
])


5.times do
User.create([
  {}
])
end
