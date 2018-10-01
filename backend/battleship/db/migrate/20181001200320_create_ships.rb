class CreateShips < ActiveRecord::Migration[5.2]
  def change
    create_table :ships do |t|
      t.string :name
      t.string :side
      t.integer :size

      t.timestamps
    end
  end
end
