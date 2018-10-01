class ShipsController < ApplicationController

def index
  @ships = Ship.all
  render json: @ships, status: :ok
end




end#end of class
