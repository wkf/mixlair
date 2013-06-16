class CreateMixes < ActiveRecord::Migration
  def change
    create_table :mixes do |t|
      t.string :name
      t.text :description

      t.decimal :volume
      t.decimal :tempo
      t.timestamps
    end
  end
end
