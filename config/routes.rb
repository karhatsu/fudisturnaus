Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :tournaments, only: [:index, :show]
      namespace :official do
        resources :matches, only: :update
      end
    end
  end

  namespace :official do
    get ':access_key' => 'official#index'
  end

  resources :tournaments, only: :show

  root to: 'home#index'
  get '*path', to: "home#index"
end
