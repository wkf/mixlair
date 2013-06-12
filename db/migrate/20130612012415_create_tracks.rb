class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string    :name
      t.boolean   :muted
      t.boolean   :soloed
      t.float     :volume
      t.float     :pan
      t.timestamps
    end
  end
end
