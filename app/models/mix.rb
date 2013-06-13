class Mix < ActiveRecord::Base
  belongs_to :user
  has_many :tracks, :dependent => :destroy

  accepts_nested_attributes_for :tracks

  validates :user_id, presence: true
end
