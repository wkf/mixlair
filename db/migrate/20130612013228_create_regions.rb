class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.string  :name

      t.boolean :fade_in
      t.boolean :fade_out
      t.float   :start
      t.float   :start_offset
      t.float   :stop_offset
      t.float   :duration

      t.timestamps
    end
  end
end
