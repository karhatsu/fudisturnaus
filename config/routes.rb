Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tournaments, only: [:index, :show]
    end
  end

  namespace :official do
    get ':access_key' => 'official#index'
  end

  root to: 'home#index'
  get '*path', to: "home#index"
end
