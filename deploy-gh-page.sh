BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  echo 'Please merge with master and push before deploying github pages. You can push only from master branch.';
  exit 1;
fi

read -p "Did you test your changes? Are you sure you want to push? [y/n]" -n 1 -r
echo    
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git checkout -b temp-release-branch
    git add --force dist
    git status 
    git commit -m "gh pages release"
    git subtree push --prefix dist origin gh-pages
    git checkout master
    git branch -D temp-release-branch
fi
echo "Done. Make sure live page still works!"