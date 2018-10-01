class AddTurnToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :turn, :boolean
  end
end
