class User < ApplicationRecord
  has_many :ships


  def score
    return "win:#{self.win}-loss:#{self.loss}" #convert to string
  end


end
