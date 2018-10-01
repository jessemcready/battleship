class Ship < ApplicationRecord
  belongs_to :user

  def self.getEmpireShip
    return Ship.all.where(side: "empire")
  end

  def self.getRebelShip
    return Ship.all.where(side: "rebels")
  end




end
