class User < ApplicationRecord
  has_many :ships
  validates :name, presence: :true, uniqueness: :true


  def score
    return "win:#{self.win}-loss:#{self.loss}" #convert to string
  end

  def self.leaderboard
    User.all.order(win: :desc).limit(5)
  end


end
